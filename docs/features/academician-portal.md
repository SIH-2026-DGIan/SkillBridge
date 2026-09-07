# 🏛️ Academician Portal — Feature Documentation

**Route prefix**: `/academician/*`  
**Primary Users**: Faculty, professors, department heads, curriculum designers

The Academician Portal bridges the gap between what colleges teach and what industry demands. It helps faculty understand skill gaps at a batch level and align curriculum accordingly.

---

## Features

### 1. Academician Dashboard (`/academician/dashboard`)
- **Batch skill overview**: Aggregated skill proficiency across all students in the department
- **Industry demand mapping**: Current in-demand skills from active job postings vs. curriculum coverage
- **Skill gap heatmap**: Which skills are under-taught relative to industry needs
- **Student progress tracking**: Individual and cohort-level skill development over time

---

### 2. Curriculum Alignment (`/academician/curriculum`)
- Map existing course subjects to canonical skill taxonomy
- Identify subjects that address highly demanded skills
- Flag subjects with low industry relevance
- Recommend new electives or module additions based on skill gap data

---

### 3. Batch Analytics (`/academician/analytics`)
- View placement readiness score per department/branch
- Cohort skill distribution charts (Recharts radar and bar charts)
- Compare current batch skill levels vs. previous batches
- Export skill reports as CSV/PDF

---

### 4. Student Progress Tracker
- View individual student skill assessments over time
- Identify students at risk of poor placement (low match scores)
- Track which students have completed assessments and uploaded resumes

---

## Role Access Control

Academicians are restricted to `/academician/*` routes only.

---

## Key Value Proposition

Unlike traditional academic dashboards that track grades, SkillBridge's Academician Portal tracks **industry-relevant skill readiness** — giving faculty real-time feedback on how employable their students are based on live job market data.
