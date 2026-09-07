# 📚 SkillBridge — Documentation

Welcome to the SkillBridge documentation hub. Use the sections below to navigate to the information you need.

---

## 🏗️ Architecture

| Document | Description |
|:---|:---|
| [System Overview](./architecture/system-overview.md) | Full architectural breakdown — Frontend, Backend, Database, Security layers with diagrams |
| [Database Schema](./architecture/database-schema.md) | All PostgreSQL tables, columns, RLS policies, and entity relationships |
| [API Reference](./architecture/api-reference.md) | All REST API endpoints with request/response examples |

---

## 🚀 Setup & Configuration

| Document | Description |
|:---|:---|
| [Local Development](./setup/local-development.md) | Step-by-step guide to run the project locally |
| [Supabase Setup](./setup/supabase-setup.md) | How to configure the PostgreSQL database on Supabase |
| [Environment Variables](./setup/environment-variables.md) | Full reference for all `.env.local` variables |

---

## 🤖 AI & Algorithms

| Document | Description |
|:---|:---|
| [Matching Algorithm](./ai/matching-algorithm.md) | The 60/20/20 weighted scoring formula in detail |
| [Resume Parser](./ai/resume-parser.md) | How plain-text resumes are parsed and skills extracted |
| [Gemini Integration](./ai/gemini-integration.md) | Google Gemini setup, prompt design, and graceful fallback |

---

## 🎯 Feature Documentation

| Document | Description |
|:---|:---|
| [Student Portal](./features/student-portal.md) | All 11 student-facing features documented |
| [Industry Portal](./features/industry-portal.md) | Opportunity posting, candidate discovery, applicant management |
| [Academician Portal](./features/academician-portal.md) | Curriculum alignment, batch analytics, skill gap insights |
| [Institution Portal](./features/institution-portal.md) | Placement index, TPO dashboard, NAAC reporting |

---

## 📁 Project Structure (Quick Reference)

```text
SkillBridge/
├── docs/                          ← 📚 You are here
│   ├── architecture/              ← System design docs
│   ├── setup/                     ← Getting started guides
│   ├── ai/                        ← AI & algorithm docs
│   └── features/                  ← Per-portal feature docs
│
├── skillbridge/                   ← Next.js Application
│   ├── src/
│   │   ├── app/                   ← 🌐 Pages & API routes
│   │   ├── security/              ← 🛡️ RBAC, auth, sessions
│   │   ├── backend/               ← ⚙️ Services & AI wrappers
│   │   ├── database/              ← 🗄️ Types, clients, taxonomy
│   │   ├── frontend/              ← 🎨 Shared UI components
│   │   └── middleware.ts          ← 🚦 Route protection
│   ├── supabase/migrations/       ← SQL schema & migrations
│   └── README.md                  ← Quick start guide
│
└── README.md                      ← Root project overview
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|:---|:---|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, Lucide React, Recharts |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + @supabase/ssr |
| AI / LLM | Google Gemini 1.5 Flash |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

> Built for **Smart India Hackathon 2026** by Team DGIan  
> Problem Statement: AI-powered Academia-Industry Skill Bridging Platform
