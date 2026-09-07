# 🏫 Institution Portal — Feature Documentation

**Route prefix**: `/institution/*`  
**Primary Users**: Training and Placement Officers (TPO), college administration, NAAC coordinators

The Institution Portal gives college administrators a macro-level view of student placement readiness, department-wise performance, and overall skill index.

---

## Features

### 1. Institution Dashboard (`/institution/dashboard`)
- **Placement Index**: College-wide placement readiness score (0–100)
- **Batch statistics**: Total students, assessed students, students placed, offer rates
- **Department-wise breakdown**: Compare skill readiness across branches (CSE, IT, ECE, etc.)
- **Industry partnerships**: Active company relationships and open opportunity counts
- **Top performing students**: Leaderboard by match score and assessment results

---

### 2. Placement Analytics (`/institution/analytics`)
- Historical placement rate trends
- Skill gap analysis at department level
- Which skills are most lacking across the student body
- Comparison with national/regional benchmarks (planned)

---

### 3. Industry Relations Management
- View all partnered industry organizations
- Track active opportunities posted per company
- Manage MoUs and partnership agreements
- Campus recruitment drive scheduling

---

### 4. NAAC / Accreditation Reports
- Auto-generate skill gap reports for accreditation documentation
- Export student placement data in formats compatible with NAAC criteria
- Track skill development initiatives and their impact on placement rates

---

### 5. Student Cohort Management
- View all enrolled students segmented by batch year, branch, and department
- Monitor assessment completion rates
- Identify students who need intervention (low match scores, incomplete profiles)
- Bulk email/notification support for placement activities

---

## Role Access Control

Institution admins are restricted to `/institution/*` routes. Attempting to access student or industry routes redirects to `/institution/dashboard`.

---

## Key Metrics Computed

| Metric | Formula |
|:---|:---|
| Placement Index | Average match score across all students |
| Assessment Completion Rate | (Assessed students / Total students) × 100 |
| Skill Coverage | Skills with ≥60% average proficiency / Total canonical skills |
| Industry Readiness Score | Weighted combination of Placement Index + Assessment Rate |

---

## Key Value for SIH

The Institution Portal directly addresses the core SIH 2026 problem statement by giving TPOs and college administrators **actionable, data-driven insights** to improve their institution's placement outcomes — not just historical reports, but real-time skill gap intelligence.
