# 🌉 SkillBridge

**AI-Driven Career Readiness, Skill Gap Analysis & Talent Matching Platform**

SkillBridge is a modern, full-stack web platform designed to bridge the gap between higher education curricula, student skill development, and real-time industry demands.

---

## 🏗️ Architecture Overview

SkillBridge is built as a unified Next.js App Router application organized across 4 primary architectural pillars:

```
                       ┌─────────────────────────────────────────┐
                       │               SKILLBRIDGE               │
                       └─────────────────────────────────────────┘
                                            │
         ┌───────────────────┬──────────────┴──────┬───────────────────┐
         ▼                   ▼                     ▼                   ▼
    🎨 FRONTEND         ⚙️ BACKEND             🗄️ DATABASE         🛡️ SECURITY
  (App & UI Views)    (APIs & AI Engines)   (Supabase & Models)  (Auth & Middleware)
```

### 1. 🎨 Frontend (Client & UI Layer)
* **Framework**: Next.js 16 (React 19, TypeScript)
* **Styling**: Tailwind CSS v4, Lucide React icons, Recharts data visualization
* **Role Portals**:
  - **Student Portal** (`src/app/student/`): Portfolio, Dynamic Resume Builder, Skill Gap Visualizer, MCQ Assessments, Job Application Tracking.
  - **Academician Portal** (`src/app/academician/`): Curriculum-to-industry alignment, batch progress analytics, skill heatmaps.
  - **Industry Portal** (`src/app/industry/`): Post opportunities/internships, candidate matching scores, applicant evaluation.
  - **Institution Portal** (`src/app/institution/`): College-level placement index, department-wise analytics, accreditation metrics.
  - **Interactive Demo** (`src/app/demo/`): Zero-config 1-click role switcher for quick demonstrations.

### 2. ⚙️ Backend & AI Services (Logic Layer)
* **AI Matching Engine** (`src/lib/ai/matching-engine.ts`): Computes multi-dimensional matching scores between student skill profiles and industry requirements.
* **Resume Parser** (`src/lib/ai/resume-parser.ts`): Extracts structured skill tags, education details, and work history.
* **Gemini AI Enhancer** (`src/lib/ai/gemini-enhancer.ts`): Google Gemini integration for generating personalized career recommendations and learning roadmaps.
* **API Endpoints** (`src/app/api/`): REST route handlers for server-side AI processing and administrative tasks.
* **Mock / Offline Fallback Engine** (`src/lib/demo-data.ts`): Deterministic mock dataset enabling the platform to run seamlessly offline or without API keys.

### 3. 🗄️ Database (Persistence Layer)
* **Database**: PostgreSQL hosted on [Supabase](https://supabase.com)
* **Schema Migrations** (`supabase/migrations/001_schema.sql`):
  - `profiles`: User information, role mapping, CGPA, college, target career roles.
  - `skills`: Canonical taxonomy of technical and soft skills.
  - `user_skills`: Student proficiency levels and verification sources.
  - `assessments`: Skill quizzes and performance tracking.
  - `opportunities` & `opportunity_skills`: Jobs, internships, and skill prerequisites.
  - `applications`: Student job application status tracking.
  - `projects` & `certifications`: Student portfolio artifacts.
* **Database Client** (`src/lib/supabase/`): Modular client configuration for both browser and SSR server contexts.

### 4. 🛡️ Security & Authentication (Security Layer)
* **Route Protection Middleware** (`src/middleware.ts`): Validates session cookies and blocks unauthenticated access to protected routes.
* **Role-Based Access Control (RBAC)**: Strictly prevents cross-role access (e.g., student accounts cannot access `/industry` or `/institution` routes).
* **Row-Level Security (RLS)**: PostgreSQL policies in `001_schema.sql` enforce data isolation at the database level so users can only view or modify their own data.
* **Session Management** (`src/lib/user-session.ts`): Manages authentication cookies, Supabase Auth tokens, and isolated demo session state.

---

## 📁 Repository Directory Structure

```text
SkillBridge/
├── skillbridge/                     # Next.js Application Root
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── (auth)/              # Login, Signup, Onboarding
│   │   │   ├── academician/         # Academician Dashboard & Tools
│   │   │   ├── api/                 # Backend API Route Handlers
│   │   │   ├── demo/                # Role switcher demo page
│   │   │   ├── industry/            # Recruiter / Industry Dashboard
│   │   │   ├── institution/         # College / Institution Admin Dashboard
│   │   │   ├── portfolio/           # Public student portfolio view
│   │   │   ├── student/             # Student Portal
│   │   │   │   ├── applications/    # Application tracking
│   │   │   │   ├── assessment/      # Skill quiz & testing
│   │   │   │   ├── dashboard/       # Main student dashboard
│   │   │   │   ├── learning/        # Learning resources
│   │   │   │   ├── opportunities/   # Job board & matching
│   │   │   │   ├── portfolio/       # Portfolio builder
│   │   │   │   ├── resume/          # Dynamic resume builder
│   │   │   │   ├── skill-gaps/      # Skill gap radar & recommendations
│   │   │   │   └── skills/          # Skill inventory
│   │   │   ├── globals.css          # Global CSS & Tailwind configuration
│   │   │   └── layout.tsx           # Root HTML layout & font providers
│   │   ├── components/              # Shared UI components & icons
│   │   ├── lib/
│   │   │   ├── ai/                  # Gemini, matching, & parser engines
│   │   │   ├── supabase/            # Browser & Server Supabase clients
│   │   │   ├── assessment-questions.ts # Question banks
│   │   │   ├── demo-data.ts         # Mock datasets
│   │   │   ├── skills-taxonomy.ts   # Canonical skills list
│   │   │   └── user-session.ts      # Session & cookie helpers
│   │   └── middleware.ts            # RBAC & Auth route protection
│   ├── supabase/
│   │   └── migrations/
│   │       └── 001_schema.sql       # PostgreSQL schema & RLS policies
│   ├── public/                      # Static assets & public media
│   ├── .env.example                 # Sample environment variables
│   ├── package.json                 # Project dependencies & scripts
│   └── tsconfig.json                # TypeScript configuration
└── README.md                        # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.18 or higher)
- npm, pnpm, or yarn

### 1. Clone & Navigate to Project
```bash
git clone https://github.com/SIH-2026-DGIan/SkillBridge.git
cd SkillBridge/skillbridge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Supabase (Optional for demo mode, required for production persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI (Optional - falls back to deterministic engine if not provided)
GEMINI_API_KEY=your_gemini_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Database (Supabase)
1. Create a project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in the Supabase dashboard.
3. Paste and run the contents of [`supabase/migrations/001_schema.sql`](skillbridge/supabase/migrations/001_schema.sql).

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 **Demo Mode**: Navigate to `/demo` to instantly test all four roles (Student, Industry, Academician, Institution) without needing a database or login credentials!

---

## 🤝 Contributing & Team Guidelines

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for our Git branching strategy, Conventional Commit guidelines, and code review standards before submitting pull requests.
