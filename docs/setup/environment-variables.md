# 🔑 Environment Variables Reference

All environment variables for SkillBridge are stored in `skillbridge/.env.local`.  
A template with placeholder values is provided in [`skillbridge/.env.example`](../../skillbridge/.env.example).

---

## Quick Setup

```bash
cd skillbridge
cp .env.example .env.local
```

Then fill in the values below.

---

## Variables Reference

### Supabase (Database & Auth)

| Variable | Required | Description |
|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional* | Your Supabase project URL. Format: `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional* | Supabase `anon` public key for client-side auth |

> *Optional for Demo Mode. Required for production with real user accounts.

**Where to find them**: Supabase Dashboard → Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9...
```

**How the app detects demo mode:**
```typescript
// middleware.ts
const hasSupabase = supabaseUrl && supabaseUrl !== 'your_supabase_project_url';
```
If the URL equals the placeholder string, the app automatically uses demo/mock data.

---

### Google Gemini AI

| Variable | Required | Description |
|:---|:---|:---|
| `GEMINI_API_KEY` | Optional | Google Gemini API key for AI-powered career recommendations |

> Optional. If not set, the app uses deterministic template-based recommendations instead.

**How to get it**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key

```env
GEMINI_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How it's used** ([`src/lib/ai/gemini-enhancer.ts`](../../skillbridge/src/lib/ai/gemini-enhancer.ts)):
```typescript
if (!apiKey) {
  return generateFallbackRecommendation(input); // works without API key
}
// Uses gemini-1.5-flash model
```

---

### App Configuration

| Variable | Required | Description |
|:---|:---|:---|
| `NEXT_PUBLIC_APP_URL` | Optional | Public base URL of the application |

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Local development
NEXT_PUBLIC_APP_URL=https://skillbridge.vercel.app  # Production
```

Used for generating absolute URLs in portfolio links and email templates.

---

## Demo Mode vs Production Mode

| Feature | Demo Mode | Production Mode |
|:---|:---|:---|
| User accounts | Simulated via cookie | Real Supabase Auth |
| Data storage | localStorage | Supabase PostgreSQL |
| AI recommendations | Template-based | Gemini 1.5 Flash |
| Skills data | `demo-data.ts` | Supabase `user_skills` |
| Opportunities | `demo-data.ts` | Supabase `opportunities` |

---

## Security Notes

> [!CAUTION]
> - **Never commit** `.env.local` to Git — it is already in `.gitignore`
> - The `NEXT_PUBLIC_` prefix means these variables are exposed to the browser. Only use it for non-sensitive public keys (like the Supabase anon key, which is safe to expose).
> - Keep `GEMINI_API_KEY` server-side only — it does NOT have the `NEXT_PUBLIC_` prefix.

```bash
# Verify .env.local is gitignored
cat .gitignore | grep env
# Should show: .env.local
```
