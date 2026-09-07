# 📋 SIH 2026 — Official Problem Statement Gap Analysis

## SkillBridge vs. Required Features

> **Legend**: ✅ Built | ⚠️ Partial | ❌ Missing

---

## 1. SKILL DEVELOPMENT

| Requirement | Status | Notes |
|:---|:---:|:---|
| Skill assessment via questionnaire | ✅ | `/student/assessment` — MCQ quiz across 36 skills |
| Skill profiling (technical + soft skills) | ✅ | `matching-engine.ts` + `/student/skills` |
| Identify strengths and skill gaps | ✅ | `/student/skill-gaps` — radar chart vs target role |
| Personalized learning recommendations | ✅ | `/student/learning` — curated resources per skill gap |
| Certification programs & industry training | ⚠️ | Resources listed but no enrollment/completion tracking |
| Career guidance based on interests & demand | ✅ | AI match score + Gemini recommendation text |
| **Verified** digital portfolio (skills, certifications, projects) | ⚠️ | Portfolio exists at `/student/portfolio` but **no verification mechanism** |
| Aptitude tests (beyond skill MCQs) | ❌ | Only skill-specific MCQs; no general aptitude test |

---

## 2. INTERNSHIP

| Requirement | Status | Notes |
|:---|:---:|:---|
| Centralized portal — industries post internships | ✅ | `/industry/opportunities/new` |
| Match students to internships by skill profile | ✅ | `calculateMatch()` — 60/20/20 formula |
| Student internship application & tracking | ✅ | `/student/applications` |
| **Academician portal: faculty internships** | ❌ | Academician nav has "FDP Programs" route but page is stub/missing |
| **Academician portal: Faculty Development Programs (FDPs)** | ⚠️ | Dashboard shows demo FDP data, no real FDP browsing/apply |
| **Academician portal: consultancy opportunities** | ❌ | Not built |
| **Academician portal: collaborative research projects** | ❌ | Nav has `/academician/research` but page doesn't exist |
| Progress tracking & mentor feedback | ❌ | No internship progress/mentor feedback system |
| Internship completion records | ❌ | No completion certificate or record system |
| Apprenticeships as opportunity type | ❌ | Only: `internship`, `job`, `live_project` in schema |

---

## 3. PLACEMENT

| Requirement | Status | Notes |
|:---|:---:|:---|
| Industry portal for posting job opportunities | ✅ | `/industry/opportunities/new` |
| Recommendation engine — match students to placements | ✅ | `rankOpportunities()` in matching engine |
| Candidate shortlisting by skill compatibility | ✅ | `/industry/opportunities/[id]/candidates` |
| Application tracking for students | ✅ | `/student/applications` |
| Recruitment management for recruiters | ⚠️ | Applications viewable but no status update UI for recruiter |
| **Analytics dashboards for institutions** | ⚠️ | `/institution/analytics` exists but uses mock/hardcoded data |
| **Analytics dashboards for industries** | ❌ | No industry-facing analytics page |
| Skill demand trend reports | ❌ | Not built |
| Placement readiness reporting | ⚠️ | Institution dashboard shows placement index but not exportable |

---

## 4. ACADEMICIAN PORTAL (Biggest Gap)

| Requirement | Status | Notes |
|:---|:---:|:---|
| Faculty internship portal | ❌ | Nav link exists but page missing |
| Industrial training opportunities | ❌ | Not built |
| Faculty Development Programs (FDPs) | ⚠️ | Demo data on dashboard, no browse/apply/track |
| Consultancy opportunities | ❌ | Not built |
| Collaborative research projects | ❌ | `/academician/research` route — page missing |
| Mentorship program management | ❌ | `/academician/mentorship` route — page missing |
| Industry–academia workshops / guest lectures | ❌ | Not built |
| Innovation challenges | ❌ | Not built |
| Live industry projects for academicians | ❌ | Not built |

---

## 5. INSTITUTION PORTAL

| Requirement | Status | Notes |
|:---|:---:|:---|
| Monitor student skill development | ⚠️ | Dashboard shows aggregate stats but uses mock data |
| Monitor internship participation | ❌ | Not tracked at institution level |
| Placement progress dashboards | ⚠️ | `/institution/placements` exists — needs real data |
| Analytics & reporting | ⚠️ | `/institution/analytics` page built but not data-driven |
| Export placement/skill reports | ❌ | No CSV/PDF export feature |

---

## 6. OVERALL PLATFORM FEATURES

| Requirement | Status | Notes |
|:---|:---:|:---|
| Role-based access control (RBAC) | ✅ | Middleware + per-role route isolation |
| Secure document management (resumes, certificates) | ⚠️ | Resume parsed client-side; no secure cloud file storage |
| **Collaboration features** | ❌ | No mentorship chat, workshop registration, live project rooms |
| **Integration with learning platforms** | ❌ | Resources link out externally; no OAuth/LMS integration |
| Integration with certification providers | ❌ | Not built |
| Integration with institutional databases | ❌ | Not built |
| Comprehensive analytics (institutions + industries + policymakers) | ⚠️ | Partial — institution dashboard only, hardcoded data |
| Search across internship & placement opportunities | ⚠️ | Basic filter UI exists, no full-text search |

---

## Priority Build List

### 🔴 Critical (Core Problem Statement — Must Have)

1. **Academician FDP/Research/Mentorship pages** — `/academician/opportunities`, `/academician/research`, `/academician/mentorship` (routes exist in nav, pages are missing)
2. **Internship progress tracking & mentor feedback** — students need to log progress; mentors need to give feedback
3. **Skill verification mechanism** — portfolio skills marked as "self-reported" vs "verified by industry/assessment"
4. **Recruitment management UI for industry** — recruiters must be able to update application status (Shortlist / Reject / Accept)

### 🟡 Important (Differentiators for SIH scoring)

5. **Institution analytics — real data** — connect `/institution/analytics` to Supabase instead of hardcoded mock
6. **Industry analytics dashboard** — recruitment outcomes, skill demand trends for industry users
7. **FDP browsing & apply flow** — academicians should be able to browse, bookmark, and apply for FDPs
8. **Collaboration hub** — guest lecture requests, workshop registrations, innovation challenge listings
9. **Apprenticeship** as an opportunity type in schema + UI

### 🟢 Good to Have (Polish)

10. **Report export** (CSV/PDF) for institution placement data
11. **Supabase Storage** for secure document uploads (resumes, certificates, internship reports)
12. **Learning platform integrations** (Coursera, NPTEL OAuth linking)
13. **General aptitude test** beyond skill-specific MCQs
14. **Notification system** — real-time alerts for application status changes

---

## Coverage Score

| Domain | Built | Partial | Missing | Coverage |
|:---|:---:|:---:|:---:|:---:|
| Skill Development | 5 | 2 | 1 | **75%** |
| Internship | 3 | 1 | 6 | **35%** |
| Placement | 3 | 3 | 2 | **56%** |
| Academician Portal | 0 | 1 | 8 | **8%** |
| Institution Portal | 0 | 3 | 2 | **30%** |
| Platform Features | 2 | 3 | 5 | **35%** |
| **Overall** | **13** | **13** | **24** | **~46%** |

> The **Academician Portal is the largest gap** — it is the unique differentiator in this problem statement vs. standard job portals.
