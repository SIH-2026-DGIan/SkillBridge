# 🗄️ Supabase Setup Guide

This guide explains how to connect SkillBridge to a real Supabase PostgreSQL database for full persistence.

> ⚠️ **This step is OPTIONAL.** SkillBridge runs perfectly in Demo Mode without Supabase. Only follow this guide when you want real user accounts and persistent data.

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `skillbridge`
   - **Database Password**: Create a strong password and save it
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
5. Click **"Create new project"** and wait ~2 minutes for provisioning

---

## Step 2 — Get Your API Keys

1. In your Supabase Dashboard, go to **Settings → API**
2. Copy the following values:

| Key | Where to Find | Used For |
|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Connecting to database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key | Client-side auth |

---

## Step 3 — Add Keys to `.env.local`

Open `skillbridge/.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4 — Apply the Database Schema

1. In the Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open [`skillbridge/supabase/migrations/001_schema.sql`](../../skillbridge/supabase/migrations/001_schema.sql)
4. Copy the **entire file contents** and paste into the SQL Editor
5. Click **"Run"**

You should see: `Success. No rows returned`

This creates all tables, enables RLS, adds policies, triggers, and seeds the canonical skills taxonomy.

---

## Step 5 — Seed Demo Data (Optional)

To populate the database with demo opportunities and learning resources, call the seed API:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

Or open your browser and navigate to:
```
http://localhost:3000/api/admin/seed
```
(Use a REST client like Postman or Insomnia for a POST request)

---

## Step 6 — Enable Email Auth

1. In Supabase Dashboard → **Authentication → Settings**
2. Under **Email**, make sure **"Enable email confirmations"** is configured
3. For local development, consider disabling email confirmation:
   - **Authentication → Settings → "Confirm email"** → Toggle OFF

---

## Verifying the Setup

After completing these steps, you should be able to:
1. Visit `http://localhost:3000/signup`
2. Create a new account with email/password
3. Complete the onboarding flow
4. See your profile data appear in **Supabase Dashboard → Table Editor → profiles**

---

## Supabase Table Editor

You can view and manage all your data directly in the Supabase Dashboard:
- **Table Editor** — Browse, filter, and edit rows
- **SQL Editor** — Run custom queries
- **Authentication** — Manage user accounts
- **Logs** — Debug API calls and errors

---

## Row Level Security Verification

To verify RLS is active:

```sql
-- Run in SQL Editor — should show RLS enabled for each table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.
