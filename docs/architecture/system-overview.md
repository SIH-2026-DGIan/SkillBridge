# 🏗️ SkillBridge — System Architecture Overview

## What is SkillBridge?

SkillBridge is an AI-powered Academia-Industry bridging platform that connects **students**, **academicians**, **industry recruiters**, and **institution administrators** in a unified ecosystem.

It addresses the core problem: *graduates are academically qualified but industry-unready due to skill gaps between curricula and real-world demands.*

---

## High-Level Architecture

```
                    ┌─────────────────────────────────────────────────┐
                    │                   SKILLBRIDGE                   │
                    │         Next.js 16 · React 19 · TypeScript      │
                    └─────────────────────────────────────────────────┘
                                          │
        ┌─────────────────┬───────────────┴───────────┬──────────────────┐
        ▼                 ▼                           ▼                  ▼
  🎨 FRONTEND         ⚙️ BACKEND                🗄️ DATABASE         🛡️ SECURITY
  src/app/            src/backend/              src/database/       src/security/
  src/frontend/       src/lib/ai/              supabase/           src/middleware.ts
                      src/app/api/
```

---

## The 4 Architectural Layers

### 1. 🎨 Frontend Layer (`src/app/` + `src/frontend/`)

The presentation layer built with Next.js App Router. Each user role has its own dedicated portal with isolated routes and layouts.

| Portal | Route Prefix | Primary Users |
|:---|:---|:---|
| Student Portal | `/student/*` | College students |
| Industry Portal | `/industry/*` | Recruiters, HR teams |
| Academician Portal | `/academician/*` | Professors, faculty |
| Institution Portal | `/institution/*` | College TPO, admin |
| Public / Auth | `/`, `/login`, `/signup`, `/portfolio/*` | Everyone |
| Demo Mode | `/demo` | Evaluators, judges, testers |

**Key Frontend Files:**
```
src/app/
├── page.tsx                   # Landing page
├── layout.tsx                 # Root HTML shell
├── globals.css                # Tailwind v4 + design tokens
├── student/layout.tsx         # Student sidebar navigation
├── academician/layout.tsx     # Academician layout
└── industry/layout.tsx        # Industry layout
```

**Shared UI Components** (`src/frontend/components/`):
- `ScoreBadge` — color-coded percentage badge (green/yellow/red)
- `ProgressBar` — animated skill proficiency bar
- `Badge` — status tags (applied, shortlisted, rejected, etc.)

---

### 2. ⚙️ Backend & AI Layer (`src/backend/` + `src/lib/ai/` + `src/app/api/`)

Server-side logic, AI engines, and REST API endpoints.

```
src/lib/ai/
├── matching-engine.ts    # Core scoring algorithm (60/20/20 formula)
├── resume-parser.ts      # Skill & metadata extraction from CVs
└── gemini-enhancer.ts    # Google Gemini LLM integration

src/app/api/
├── ai/match/route.ts     # POST /api/ai/match
└── admin/seed/route.ts   # POST /api/admin/seed
```

**AI Data Flow:**

```
Student submits resume
        │
        ▼
resume-parser.ts
  extracts skills & experience
        │
        ▼
Skills stored in localStorage/Supabase
        │
        ▼
matching-engine.ts
  calculateMatch(userProfile, opportunityProfile)
  → score = 60% skill + 20% interest + 20% projects
        │
        ▼
gemini-enhancer.ts (if GEMINI_API_KEY set)
  Generates personalized recommendation text
        │
        ▼
Response returned to UI
```

---

### 3. 🗄️ Database Layer (`src/database/` + `supabase/`)

PostgreSQL database hosted on Supabase with typed models and migrations.

```
supabase/migrations/
└── 001_schema.sql    # Complete schema: tables + RLS policies + triggers + seed

src/database/
├── types.ts          # TypeScript interfaces mirroring all SQL tables
├── client.ts         # Browser Supabase client
├── server.ts         # SSR Supabase client
├── taxonomy.ts       # Canonical skills taxonomy
└── seed.ts           # Mock data for offline / demo mode
```

**Entity Relationships:**

```
auth.users
    │
    └──▶ profiles (role, college, company, etc.)
              │
              ├──▶ user_skills (proficiency per skill)
              ├──▶ assessments (quiz scores)
              ├──▶ applications ──▶ opportunities
              ├──▶ projects
              └──▶ certifications

skills (canonical taxonomy)
    │
    └──▶ user_skills
    └──▶ opportunity_skills ──▶ opportunities
```

---

### 4. 🛡️ Security Layer (`src/security/` + `src/middleware.ts`)

Authentication, authorization, and data isolation.

```
src/middleware.ts           # Route-level auth guard (runs on every request)
src/security/
├── rbac.ts                 # Role-based access control rules
├── session.ts              # Cookie/localStorage session helpers
├── auth.ts                 # Supabase Auth wrappers
└── index.ts                # Barrel export
```

**Request Lifecycle:**

```
Browser Request
      │
      ▼
middleware.ts intercepts
      │
      ├─ Is it a public route? ──YES──▶ Allow
      │
      ├─ Has demo session cookie? ──YES──▶ Validate role ──▶ Allow or redirect
      │
      ├─ Has Supabase session? ──YES──▶ supabase.auth.getUser() ──▶ Allow
      │
      └─ No session ──▶ Redirect to /demo
```

---

## Technology Stack

| Category | Technology | Version |
|:---|:---|:---|
| Framework | Next.js | 16.3.2 |
| UI Library | React | 19.2.8 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | Supabase (PostgreSQL) | Latest |
| AI / LLM | Google Gemini | 1.5-flash |
| Charts | Recharts | 3.x |
| Icons | Lucide React | Latest |
| Forms | React Hook Form + Zod | Latest |
| Auth | Supabase Auth + @supabase/ssr | Latest |

---

## Offline / Demo Mode

SkillBridge works 100% without any external services configured:

- **No Supabase?** → All data served from `src/lib/demo-data.ts`
- **No Gemini API key?** → AI text generated from deterministic templates in `gemini-enhancer.ts`
- **No login?** → Demo cookie session from `/demo` page simulates all 4 roles

This enables zero-config evaluation for judges and hackathon demos.
