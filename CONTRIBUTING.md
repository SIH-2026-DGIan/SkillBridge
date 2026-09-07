# 🤝 SkillBridge — Team Contribution Guide

Welcome to the **SkillBridge** development team! This guide establishes our team workflow, coding conventions, Git branching strategy, and pull request standards for the project.

---

## 📋 Table of Contents
1. [Prerequisites & Environment Setup](#-prerequisites--environment-setup)
2. [Project Architecture Overview](#-project-architecture-overview)
3. [Git Branching Strategy](#-git-branching-strategy)
4. [Commit Message Standards](#-commit-message-standards)
5. [Development & Coding Standards](#-development--coding-standards)
6. [Pull Request (PR) Checklist](#-pull-request-pr-checklist)
7. [Team Roles & Task Coordination](#-team-roles--task-coordination)

---

## 🛠️ Prerequisites & Environment Setup

### 1. Requirements
* **Node.js**: `v18.18.0` or `v20.x` LTS recommended
* **Package Manager**: `npm` (comes with Node.js)
* **Git**: Installed and configured with your name and GitHub email

### 2. First-Time Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/SIH-2026-DGIan/SkillBridge.git
cd SkillBridge/skillbridge

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local  # (or create .env.local manually)
```

### 3. Environment Variables (`.env.local`)
Ensure your `skillbridge/.env.local` contains the following keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI (Optional for live AI recommendations)
GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** The platform includes an offline/demo fallback engine (`src/lib/demo-data.ts`), so the UI and core flows function even without live API credentials.

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture Overview

All application source code resides under `skillbridge/src/`:

```
skillbridge/
├── src/
│   ├── app/                    # Next.js App Router (Pages & Routes)
│   │   ├── page.tsx            # Main Landing / Discovery Experience
│   │   ├── student/            # Student Portal (Dashboard, Portfolio, Skills, Opportunities)
│   │   ├── academician/        # Faculty Portal (Curriculum, FDPs, Research)
│   │   ├── industry/           # Recruiter Portal (Job Postings, Talent Radar)
│   │   ├── institution/        # College TPO & Accreditation Metrics
│   │   ├── demo/               # 1-Click Interactive Role Switcher
│   │   └── api/                # API Route Handlers
│   ├── components/             # Reusable UI Components & Navigation
│   ├── lib/
│   │   ├── ai/                 # Matching engine, resume parser, Gemini API
│   │   ├── supabase/           # Supabase client & server instances
│   │   ├── demo-data.ts        # Offline fallback mock data
│   │   └── user-session.ts     # Client/Server session handlers
│   └── types/                  # TypeScript interfaces and shared schemas
├── supabase/
│   └── migrations/             # SQL schema migrations & Row Level Security (RLS)
└── docs/                       # Project documentation & issue trackers
```

---

## 🌿 Git Branching Strategy

To avoid merge conflicts and keep `main` stable, **never push directly to `main`**.

### Branch Naming Format: `<type>/<short-description>`

| Prefix | Use Case | Example |
| :--- | :--- | :--- |
| `feat/` | New features or core user flows | `feat/resume-parser-ui` |
| `fix/` | Bug fixes or broken logic | `fix/auth-session-redirect` |
| `ui/` | UI/UX visual redesigns or layout polish | `ui/clean-student-dashboard` |
| `refactor/` | Code reorganization without feature change | `refactor/supabase-client` |
| `docs/` | Documentation, guides, and issue updates | `docs/update-architecture` |

### Step-by-Step Workflow for Team Members:
```bash
# 1. Update your local main branch
git checkout main
git pull origin main

# 2. Create your feature/fix branch
git checkout -b feat/your-feature-name

# 3. Make changes and commit frequently
git add .
git commit -m "feat(student): add skill assessment score card"

# 4. Push your branch to GitHub
git push -u origin feat/your-feature-name

# 5. Open a Pull Request (PR) on GitHub against 'main'
```

---

## ✍️ Commit Message Standards

We use **Conventional Commits** so the project history stays readable:

```
<type>(<scope>): <short description in present tense>
```

### Examples:
* `feat(student): implement interactive skill diagnostic quiz`
* `fix(auth): prevent infinite loop on unauthenticated dashboard access`
* `ui(landing): polish responsive hero banner and role category cards`
* `docs(readme): update Supabase setup instructions`
* `refactor(matching): optimize skill overlap scoring algorithm`

---

## 💻 Development & Coding Standards

### 1. TypeScript Strictness
* Avoid using `any`. Define clear interfaces in `src/types/` or directly in component files when scoped.
* Always check for null/undefined before accessing nested properties (use optional chaining `?.`).

### 2. Client vs Server Components (Next.js App Router)
* Next.js App Router components are **Server Components by default**.
* Only add `'use client';` at the top of a file if the component uses:
  - React hooks (`useState`, `useEffect`, `useRouter`, etc.)
  - Browser events (`onClick`, `onChange`, `onSubmit`)
  - Browser-only APIs (`window`, `localStorage`)

### 3. Styling & Design Consistency
* Use **Tailwind CSS v4** utility classes.
* Stick to the project's design system:
  - Primary Brand Accent: `#0066FF` / Indigo `#4F46E5`
  - Background Neutral: `#F8FAFC` / `#F1F5F9`
  - Text Primary: `#0F172A`
  - Text Muted: `#64748B`
  - Card Radius: `rounded-2xl` or `rounded-3xl`
* Avoid hardcoding ad-hoc arbitrary styles; reuse Tailwind classes and theme variables defined in `src/app/globals.css`.

### 4. Zero-Crash Demo Rule (Crucial for SIH)
* **Never let a screen crash with a blank white page** if an API key is missing or Supabase is slow.
* Always wrap network calls in `try/catch` blocks and fall back gracefully to `src/lib/demo-data.ts`.

---

## ✅ Pull Request (PR) Checklist

Before asking a teammate to review your PR, verify the following:

- [ ] **Build Check**: Ran `npm run build` locally in `skillbridge/` and it compiled with **0 errors**.
- [ ] **Type Check**: Ran `npx tsc --noEmit` and resolved any TypeScript warnings.
- [ ] **Console Cleanliness**: Opened browser DevTools on your page and verified there are no runtime errors.
- [ ] **Responsive Design**: Checked that the UI looks clean on both desktop (1920x1080) and mobile viewports.
- [ ] **PR Description**: Added 2–3 bullet points explaining what was changed and attached a screenshot/recording if UI was modified.

---

## 👥 Team Coordination

* **Issue Tracking**: Refer to [`docs/GITHUB_ISSUES.md`](file:///c:/Users/Sanskruti/Skill-Bridge/SkillBridge/docs/GITHUB_ISSUES.md) to pick up unassigned tasks.
* **Avoid Collisions**: Before starting work on a major page or file (e.g., `layout.tsx` or `globals.css`), drop a message in the team chat so teammates don't overwrite each other's work.
* **Questions or Blockers?** Reach out to the team lead or tag teammates directly on the GitHub Issue/PR.

Happy building! Let's make SkillBridge an impactful, award-winning platform! 🚀
