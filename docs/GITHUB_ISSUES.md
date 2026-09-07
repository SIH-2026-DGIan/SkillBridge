# 🐛 GitHub Issues — SkillBridge SIH 2026

Copy each issue below and paste into GitHub → Issues → New Issue.
Repo: https://github.com/SIH-2026-DGIan/SkillBridge/issues/new

---

## ISSUE #1 — [CRITICAL] Academician FDP Programs Page
**Label**: `enhancement`, `academician`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(academician): Build FDP Programs browsing & application page`

### Description
```
## Context
The Academician portal's sidebar links to `/academician/opportunities` (Faculty Development Programs)
but this page does not exist yet. The SIH problem statement explicitly requires:
- Faculty internships
- Faculty Development Programs (FDPs)
- Consultancy opportunities

## File to create
`skillbridge/src/app/academician/opportunities/page.tsx`

The route already exists in the nav (academician/layout.tsx line 11).

## Acceptance Criteria
- [ ] Browse FDP listings (title, organizer, location, date, funding status)
- [ ] Filter by category: FDP / Faculty Internship / Consultancy / Workshop
- [ ] Apply / Express Interest button per listing
- [ ] Show application status badge
- [ ] Demo data from `src/lib/demo-data.ts` (add DEMO_FACULTY_OPPORTUNITIES array)

## Reference
- SIH requirement: "Provide a dedicated portal for academicians to explore faculty internships, FDPs, consultancy opportunities"
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 2 (Internship)
- Nav link already set up: src/app/academician/layout.tsx#L12
```

---

## ISSUE #2 — [CRITICAL] Academician Joint Research Page
**Label**: `enhancement`, `academician`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(academician): Build Joint Research & Collaborative Projects page`

### Description
```
## Context
The nav links to `/academician/research` but the page doesn't exist.
SIH requires: "collaborative research projects" between industry and academia.

## File to create
`skillbridge/src/app/academician/research/page.tsx`

## Acceptance Criteria
- [ ] Browse active collaborative research projects posted by industry
- [ ] Filter by domain (AI/ML, Biotech, EV, etc.)
- [ ] Show funding agency, duration, partner institution
- [ ] Expression of interest / Apply flow
- [ ] Show research grants and bilateral programs

## Reference
- Nav link: src/app/academician/layout.tsx#L13
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md
```

---

## ISSUE #3 — [CRITICAL] Academician Mentorship Program Page
**Label**: `enhancement`, `academician`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(academician): Build Mentorship Program management page`

### Description
```
## Context
The nav links to `/academician/mentorship` but the page doesn't exist.
SIH requires mentorship programs, workshops, and guest lecture facilitation.

## File to create
`skillbridge/src/app/academician/mentorship/page.tsx`

## Acceptance Criteria
- [ ] View assigned student mentees list
- [ ] Submit mentor feedback per student
- [ ] Browse upcoming workshop / guest lecture opportunities
- [ ] Register to conduct a guest lecture / workshop at institutions
- [ ] Track mentorship session history

## Reference
- Nav link: src/app/academician/layout.tsx#L14
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md
```

---

## ISSUE #4 — [CRITICAL] Internship Progress Tracking & Mentor Feedback
**Label**: `enhancement`, `student`, `industry`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(student+industry): Internship progress tracking and mentor feedback system`

### Description
```
## Context
SIH requirement: "Progress tracking, mentor feedback, and internship completion records"
Currently, students can apply but there is NO way to track internship progress once selected.

## Files to create/modify
- `skillbridge/src/app/student/applications/page.tsx` — add progress timeline
- `skillbridge/src/app/industry/applications/page.tsx` — add mentor feedback form
- `skillbridge/supabase/migrations/` — add internship_progress table

## Acceptance Criteria
- [ ] Student: View active internship progress (Week 1, Week 2... milestone tracker)
- [ ] Student: View mentor feedback messages
- [ ] Industry/Mentor: Submit weekly feedback for a shortlisted intern
- [ ] On internship completion: generate a completion badge on student portfolio
- [ ] DB: `internship_progress` table with (student_id, opportunity_id, week, status, mentor_note)

## Reference
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 2
```

---

## ISSUE #5 — [CRITICAL] Skill Verification System
**Label**: `enhancement`, `student`, `security`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(portfolio): Add skill verification — self-reported vs verified badge`

### Description
```
## Context
SIH requirement: "verified skills, certifications, projects, and achievements"
Currently ALL skills are self-reported or from assessment. There is no "verified" status shown.

## Files to modify
- `skillbridge/src/app/student/portfolio/page.tsx` — show verification badges
- `skillbridge/src/app/student/skills/page.tsx` — show source (self / assessment / verified)
- `skillbridge/src/database/types.ts` — UserSkill.source already has 'verified' value

## Acceptance Criteria
- [ ] Skills from completed assessment show ✅ "Assessment Verified" badge
- [ ] Skills from resume upload show 📄 "Self Reported" badge  
- [ ] Skills verified by industry mentor show 🏭 "Industry Verified" badge
- [ ] Portfolio page clearly distinguishes skill verification levels
- [ ] Certification cards link to credential URL for external verification

## Reference
- `src/database/types.ts` — UserSkill.source: 'assessment' | 'self' | 'verified'
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 1
```

---

## ISSUE #6 — [CRITICAL] Industry Recruiter — Application Status Management
**Label**: `enhancement`, `industry`, `critical`
**Assignee**: (pick a teammate)

### Title
`feat(industry): Allow recruiters to update application status (shortlist/reject/accept)`

### Description
```
## Context
Currently industry can VIEW applicants but cannot update their status.
SIH requirement: "Candidate shortlisting based on skill compatibility" and "Recruitment management"

## Files to modify
- `skillbridge/src/app/industry/applications/page.tsx` — add status buttons
- `skillbridge/src/app/industry/opportunities/[id]/candidates/page.tsx` — bulk shortlist

## Acceptance Criteria
- [ ] Per applicant: Shortlist / Reject / Schedule Interview / Accept buttons
- [ ] Bulk action: Select top N candidates by match score → Shortlist all
- [ ] Status change updates `applications.status` in Supabase (or localStorage in demo)
- [ ] Student receives notification when their status changes
- [ ] Recruiter can add private notes per candidate

## Reference
- applications table: supabase/migrations/001_schema.sql
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 3
```

---

## ISSUE #7 — [IMPORTANT] Institution Analytics — Connect to Real Data
**Label**: `enhancement`, `institution`, `analytics`
**Assignee**: (pick a teammate)

### Title
`feat(institution): Connect analytics dashboard to real Supabase data`

### Description
```
## Context
`/institution/analytics` page exists but displays hardcoded mock numbers.
SIH requirement: "Analytics and reporting dashboards for institutions"

## Files to modify
- `skillbridge/src/app/institution/analytics/page.tsx`
- `skillbridge/src/app/institution/dashboard/page.tsx`
- `skillbridge/src/app/institution/students/page.tsx`

## Acceptance Criteria
- [ ] Fetch real student counts from `profiles` table
- [ ] Calculate real average skill score from `user_skills` table
- [ ] Show real internship application counts from `applications` table  
- [ ] Recharts bar/radar charts populated from real Supabase data
- [ ] Works in demo mode with mock data fallback

## Reference
- Database schema: supabase/migrations/001_schema.sql
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 5
```

---

## ISSUE #8 — [IMPORTANT] Industry Analytics Dashboard
**Label**: `enhancement`, `industry`, `analytics`
**Assignee**: (pick a teammate)

### Title
`feat(industry): Build industry analytics — skill demand trends & recruitment outcomes`

### Description
```
## Context
No analytics page exists for industry users.
SIH requirement: "Analytics and reporting dashboards for... industries to monitor 
placement readiness, recruitment outcomes, and skill demand trends."

## File to create
`skillbridge/src/app/industry/analytics/page.tsx`

## Acceptance Criteria
- [ ] Total applications received across all posted opportunities
- [ ] Average match score of applicants
- [ ] Skill demand heatmap — which skills are most requested in their postings
- [ ] Application funnel: Applied → Shortlisted → Interviewed → Hired
- [ ] Top colleges/branches submitting applications

## Reference
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 3
```

---

## ISSUE #9 — [IMPORTANT] Collaboration Hub — Workshops, Guest Lectures, Innovation Challenges
**Label**: `enhancement`, `collaboration`, `new-feature`
**Assignee**: (pick a teammate)

### Title
`feat: Build Industry-Academia Collaboration Hub (workshops, guest lectures, challenges)`

### Description
```
## Context
SIH requirement: "Facilitate industry–academia collaboration through mentorship programs, 
workshops, guest lectures, innovation challenges, and live industry projects."
This is a unique differentiator — no standard job portal has this.

## Files to create
- `skillbridge/src/app/student/collaborate/page.tsx`
- `skillbridge/src/app/academician/collaborate/page.tsx` 
- `skillbridge/src/app/industry/collaborate/page.tsx`

## Acceptance Criteria
- [ ] Industry posts: workshop, guest lecture, innovation challenge, live project
- [ ] Students can register for workshops and innovation challenges
- [ ] Academicians can register as guest lecturers or project mentors
- [ ] Events calendar view (upcoming dates)
- [ ] DB: `collaborations` table (type, title, organizer_id, date, participants[])

## Reference
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 6
```

---

## ISSUE #10 — [GOOD TO HAVE] Supabase Storage — Secure Document Uploads
**Label**: `enhancement`, `security`, `infrastructure`
**Assignee**: (pick a teammate)

### Title
`feat: Integrate Supabase Storage for secure resume, certificate, and internship report uploads`

### Description
```
## Context
SIH requirement: "Secure document management for resumes, certificates, internship reports, 
and academic records."
Currently resumes are parsed client-side from text input. No actual file upload.

## Files to create/modify
- `skillbridge/src/app/student/resume/page.tsx` — add PDF upload button
- `skillbridge/src/lib/supabase/storage.ts` — Supabase storage helpers
- `skillbridge/src/app/api/upload/route.ts` — server-side upload handler

## Acceptance Criteria
- [ ] Student can upload PDF resume → stored in Supabase Storage bucket
- [ ] Student can upload certification PDFs → linked to certification record
- [ ] Files are private (only visible to owner and assigned industry mentor)
- [ ] Resume PDF parsed server-side, extracted skills saved to user_skills
- [ ] File size limit: 5MB, types: PDF, DOCX

## Reference
- Gap Analysis: docs/SIH_GAP_ANALYSIS.md — Section 6
- Supabase Storage docs: https://supabase.com/docs/guides/storage
```

---

## ISSUE #11 — [GOOD TO HAVE] Report Export (CSV/PDF) for Institution
**Label**: `enhancement`, `institution`
**Assignee**: (pick a teammate)

### Title
`feat(institution): Add CSV and PDF export for placement and skill reports`

### Description
```
## Context
Institution admins need exportable reports for NAAC accreditation and management reviews.

## Files to modify
- `skillbridge/src/app/institution/analytics/page.tsx` — add export buttons
- `skillbridge/src/app/institution/placements/page.tsx` — add export buttons

## Acceptance Criteria
- [ ] Export student skill scores as CSV
- [ ] Export placement summary (applied/shortlisted/placed counts by branch) as CSV
- [ ] Generate PDF placement report for NAAC documentation
- [ ] Date range filter before export

## Tech suggestion
Use `jsPDF` (for PDF) or native browser CSV download (for CSV).
```

---

## HOW TO CREATE THESE ON GITHUB

1. Go to: https://github.com/SIH-2026-DGIan/SkillBridge/issues/new
2. Paste the Title
3. Paste the Description
4. Add the Labels (create labels first if needed: critical, enhancement, student, industry, academician, institution, analytics, collaboration)
5. Assign to a teammate
6. Submit

### Recommended Labels to Create First
| Label | Color | Purpose |
|:---|:---|:---|
| `critical` | `#D73A4A` (red) | Must-have for SIH |
| `enhancement` | `#84B6EB` (blue) | New feature |
| `student` | `#0075CA` | Student portal |
| `industry` | `#E4E669` | Industry portal |
| `academician` | `#D4EDDA` | Academician portal |
| `institution` | `#F9D0C4` | Institution portal |
| `analytics` | `#C5DEF5` | Data & charts |
| `collaboration` | `#BFD4F2` | Collaboration features |
| `good-first-issue` | `#7057FF` | Good for new contributors |
