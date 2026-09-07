# 🗄️ SkillBridge — Database Schema Reference

**Database**: PostgreSQL (hosted on Supabase)  
**Migration file**: [`supabase/migrations/001_schema.sql`](../../skillbridge/supabase/migrations/001_schema.sql)

---

## Tables Overview

| Table | Purpose | Row Count (Demo) |
|:---|:---|:---|
| `profiles` | User profiles for all roles | 1 per user |
| `skills` | Canonical skill taxonomy | ~36 seeded |
| `user_skills` | Student skill proficiency scores | Many per student |
| `assessments` | Completed quiz results | Many per student |
| `opportunities` | Jobs & internship listings | ~10 seeded |
| `opportunity_skills` | Required skills per opportunity | Many per opportunity |
| `applications` | Student job applications | Many per student |
| `projects` | Student portfolio projects | Many per student |
| `certifications` | Student certifications | Many per student |
| `learning_resources` | Course/resource recommendations | Many |
| `notifications` | In-app alerts | Many per user |

---

## Table Definitions

### `profiles`

Stores extended user information for all four roles. Linked to Supabase `auth.users`.

```sql
profiles (
  id               UUID PRIMARY KEY,
  user_id          UUID REFERENCES auth.users UNIQUE NOT NULL,
  role             TEXT CHECK (IN 'student','industry','institution','academician'),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  -- Student fields
  college          TEXT,
  degree           TEXT,
  branch           TEXT,
  graduation_year  INTEGER,
  cgpa             DECIMAL(3,1),
  bio              TEXT,
  location         TEXT,
  target_roles     TEXT[],
  -- Industry fields
  company          TEXT,
  -- Institution fields
  institution      TEXT,
  -- Shared
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ
)
```

---

### `skills`

Canonical skill taxonomy. All skill references across the system use `skill_id` from this table.

```sql
skills (
  id        TEXT PRIMARY KEY,   -- e.g. 'python', 'machine_learning'
  name      TEXT UNIQUE NOT NULL,
  category  TEXT CHECK (IN 'technical', 'soft')
)
```

**Seeded Technical Skills**: `python`, `javascript`, `typescript`, `java`, `cpp`, `react`, `nextjs`, `html_css`, `tailwind`, `nodejs`, `fastapi`, `django`, `sql`, `mongodb`, `machine_learning`, `deep_learning`, `tensorflow`, `pytorch`, `data_analysis`, `statistics`, `nlp`, `computer_vision`, `docker`, `kubernetes`, `aws`, `azure`, `gcp`, `git`, `linux`

**Seeded Soft Skills**: `communication`, `problem_solving`, `teamwork`, `leadership`, `critical_thinking`, `time_management`

---

### `user_skills`

Stores each student's proficiency level per skill.

```sql
user_skills (
  id           UUID PRIMARY KEY,
  user_id      UUID REFERENCES auth.users NOT NULL,
  skill_id     TEXT REFERENCES skills NOT NULL,
  proficiency  INTEGER CHECK (0..100),
  source       TEXT CHECK (IN 'assessment', 'self', 'verified'),
  updated_at   TIMESTAMPTZ,
  UNIQUE (user_id, skill_id)
)
```

**Proficiency Scale:**
- `0–30` → Beginner
- `31–60` → Intermediate  
- `61–80` → Proficient
- `81–100` → Expert

---

### `assessments`

Records completed MCQ quiz results with per-skill score breakdown.

```sql
assessments (
  id                  UUID PRIMARY KEY,
  user_id             UUID REFERENCES auth.users NOT NULL,
  score               INTEGER,
  total_questions     INTEGER,
  skill_scores        JSONB,          -- { "python": 85, "ml": 72, ... }
  category_breakdown  JSONB,          -- { "technical": 80, "soft": 70 }
  created_at          TIMESTAMPTZ
)
```

---

### `opportunities`

Job and internship listings posted by industry partners.

```sql
opportunities (
  id           UUID PRIMARY KEY,
  title        TEXT NOT NULL,
  company      TEXT NOT NULL,
  company_logo TEXT,
  type         TEXT CHECK (IN 'internship', 'job', 'live_project'),
  category     TEXT,
  location     TEXT NOT NULL,
  work_mode    TEXT CHECK (IN 'remote', 'onsite', 'hybrid'),
  duration     TEXT,
  stipend      TEXT,
  salary_range TEXT,
  description  TEXT NOT NULL,
  deadline     DATE,
  eligibility  JSONB,               -- { minCgpa, degrees, maxGradYear }
  status       TEXT DEFAULT 'active',
  posted_by    UUID REFERENCES auth.users,
  created_at   TIMESTAMPTZ
)
```

---

### `opportunity_skills`

Bridges opportunities and their required skills with minimum proficiency thresholds.

```sql
opportunity_skills (
  id              UUID PRIMARY KEY,
  opportunity_id  UUID REFERENCES opportunities NOT NULL,
  skill_id        TEXT REFERENCES skills NOT NULL,
  required_level  INTEGER CHECK (0..100),
  importance      TEXT CHECK (IN 'required', 'preferred')
)
```

---

### `applications`

Tracks student applications to opportunities.

```sql
applications (
  id              UUID PRIMARY KEY,
  opportunity_id  UUID REFERENCES opportunities NOT NULL,
  student_id      UUID REFERENCES auth.users NOT NULL,
  status          TEXT CHECK (IN 'applied','under_review','shortlisted',
                                'interviewing','rejected','accepted'),
  match_score     INTEGER,
  notes           TEXT,
  applied_at      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ
)
```

---

### `projects`

Student portfolio project showcase.

```sql
projects (
  id           UUID PRIMARY KEY,
  user_id      UUID REFERENCES auth.users NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  tags         TEXT[],
  github_url   TEXT,
  live_url     TEXT,
  stars        INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ
)
```

---

### `certifications`

Student certification badges and credentials.

```sql
certifications (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES auth.users NOT NULL,
  name            TEXT NOT NULL,
  issuer          TEXT NOT NULL,
  issued_at       DATE NOT NULL,
  credential_url  TEXT,
  badge_url       TEXT
)
```

---

### `learning_resources`

Curated course and tutorial links, linked to skills.

```sql
learning_resources (
  id           UUID PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  skill_id     TEXT REFERENCES skills,
  level        TEXT CHECK (IN 'beginner', 'intermediate', 'advanced'),
  duration     TEXT,
  url          TEXT NOT NULL,
  provider     TEXT,
  created_at   TIMESTAMPTZ
)
```

---

### `notifications`

In-app notification system for status updates.

```sql
notifications (
  id         UUID PRIMARY KEY,
  user_id    UUID REFERENCES auth.users NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT,
  type       TEXT CHECK (IN 'application','opportunity','assessment','system'),
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ
)
```

---

## Row Level Security (RLS) Policies

All tables have RLS **enabled**. These policies ensure users can only access their own data.

| Table | Policy | Rule |
|:---|:---|:---|
| `profiles` | SELECT | Own record only (`auth.uid() = user_id`) |
| `profiles` | INSERT / UPDATE | Own record only |
| `skills` | SELECT | Public (anyone can read) |
| `user_skills` | SELECT / INSERT / UPDATE | Own records only |
| `assessments` | SELECT / INSERT | Own records only |
| `opportunities` | SELECT | Public |
| `opportunities` | INSERT / UPDATE | Creator only (`posted_by = auth.uid()`) |
| `applications` | SELECT / INSERT / UPDATE | Student owns their applications |
| `projects` | SELECT | Public |
| `projects` | INSERT / UPDATE | Owner only |
| `certifications` | SELECT / INSERT | Owner only |
| `learning_resources` | SELECT | Public |
| `notifications` | SELECT / UPDATE | Owner only |

---

## Triggers

Auto-updates `updated_at` timestamps on modifications:

- `profiles_updated_at` — fires on `profiles` UPDATE
- `user_skills_updated_at` — fires on `user_skills` UPDATE
- `applications_updated_at` — fires on `applications` UPDATE

---

## How to Apply the Schema

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor**
3. Paste the contents of [`skillbridge/supabase/migrations/001_schema.sql`](../../skillbridge/supabase/migrations/001_schema.sql)
4. Click **Run**

> ✅ The schema is fully idempotent — safe to run multiple times with `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`.
