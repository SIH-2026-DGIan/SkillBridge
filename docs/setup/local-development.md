# 🚀 Local Development Setup Guide

This guide walks you through setting up SkillBridge on your local machine from scratch.

---

## Prerequisites

| Tool | Minimum Version | Install Link |
|:---|:---|:---|
| Node.js | 18.18.0+ | [nodejs.org](https://nodejs.org) |
| npm | 9.0+ | Included with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com) |

> 💡 You do **NOT** need Supabase or a Gemini API key to run the app locally. SkillBridge has a full **Demo Mode** that works offline.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/SIH-2026-DGIan/SkillBridge.git
cd SkillBridge
```

---

## Step 2 — Navigate to the App Directory

The Next.js application lives inside the `skillbridge/` folder:

```bash
cd skillbridge
```

---

## Step 3 — Install Dependencies

```bash
npm install
```

This installs all packages defined in [`package.json`](../../skillbridge/package.json).

---

## Step 4 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values. For **demo mode only**, you can leave Supabase and Gemini keys as-is:

```env
# Supabase — leave as placeholder for demo mode
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI — leave empty for deterministic fallback
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [`docs/setup/environment-variables.md`](./environment-variables.md) for a full explanation of each variable.

---

## Step 5 — Start the Development Server

```bash
npm run dev
```

The app will start at: **[http://localhost:3000](http://localhost:3000)**

---

## Step 6 — Explore the App

### Option A: Demo Mode (No Login Required)
Navigate to [http://localhost:3000/demo](http://localhost:3000/demo) and click any role button to instantly explore all 4 portals:
- 🎓 **Student** — Skill assessment, resume builder, job matching
- 🏭 **Industry** — Post opportunities, view candidates
- 🏛️ **Academician** — Curriculum alignment, batch analytics
- 🏫 **Institution** — Placement dashboard, skill index

### Option B: Full Auth Mode (With Supabase)
1. Complete [Supabase Setup](./supabase-setup.md)
2. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
3. Create an account and complete onboarding

---

## Available Scripts

| Script | Command | Description |
|:---|:---|:---|
| Dev server | `npm run dev` | Starts hot-reload development server |
| Build | `npm run build` | Builds production bundle |
| Start | `npm run start` | Starts production server (after build) |

---

## Common Issues

### `Error: Cannot find module '@/lib/...'`
Make sure you are running commands from inside the `skillbridge/` directory, not the root.

```bash
# ✅ Correct
cd SkillBridge/skillbridge
npm run dev

# ❌ Wrong
cd SkillBridge
npm run dev
```

### Port already in use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Node.js version issues
Check your Node version:
```bash
node --version  # Should be 18.18.0 or higher
```

### Dependencies not installing
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```
