# 🧠 Gemini AI Integration

**File**: [`src/lib/ai/gemini-enhancer.ts`](../../skillbridge/src/lib/ai/gemini-enhancer.ts)  
**Model Used**: `gemini-1.5-flash`  
**API**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)

---

## What It Does

The Gemini AI enhancer generates **personalized, human-readable career recommendation text** for a student after their match score has been computed by the matching engine.

It takes structured match data (score, matched skills, missing skills) and produces a 2–3 sentence recommendation that is:
- Specific to the student's profile
- Encouraging and actionable
- Grounded in the actual match score data

---

## Graceful Degradation (No API Key Required)

The integration is **fully optional**. If `GEMINI_API_KEY` is not set, the system automatically falls back to deterministic template strings:

```
┌─────────────────────┐
│ GEMINI_API_KEY set? │
└────────┬────────────┘
         │
    YES ─┤─ Call Gemini API ──SUCCESS──▶ Use AI text
         │       │
         │    FAILURE ──────────────▶ Use fallback template
         │
    NO ──┴──────────────────────────▶ Use fallback template
```

This ensures **the app never crashes or shows errors** because of a missing or failed AI call.

---

## Prompt Engineering

The prompt sent to Gemini is structured and constrained:

```
You are an AI career advisor for SkillBridge, an Academia-Industry platform.

A student has a {score}% match for "{jobTitle}" at {company}.

Match Breakdown:
- Skill Compatibility: {skillScore}%
- Interest Alignment: {interestScore}%
- Eligibility: {eligibilityScore}%
- Project Relevance: {projectScore}%

Matched Skills: {matchedSkills}
Missing Skills: {missingSkills}

Write a 2-3 sentence personalized recommendation for the student.
Be specific, encouraging, and actionable.
Focus on what makes them a strong candidate and what to improve.
Keep it under 60 words.
```

**Design choices:**
- Constrained to 60 words to prevent verbose responses
- Always encouraging (no negative framing)
- Grounded with specific skill names, not generic advice

---

## Fallback Templates

When Gemini is unavailable, three template categories are used based on score:

| Score Range | Tone | Template Focus |
|:---|:---|:---|
| ≥ 85 | Strong encouragement | "You are a strong candidate..." + specific matched skills |
| 65–84 | Solid foundation | "Good match with room to grow..." + top missing skills |
| < 65 | Growth opportunity | "This is a learning stretch..." + learning path suggestion |

---

## Setup

### 1. Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select your Google Cloud project

### 2. Add to Environment
```env
# skillbridge/.env.local
GEMINI_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verify It Works
After adding the key, trigger a match on the student opportunities page. The recommendation text will be richer and more personalized than the fallback templates.

---

## API Trigger Point

Gemini is called inside the [`POST /api/ai/match`](../../skillbridge/src/app/api/ai/match/route.ts) route handler — **server-side only**:

```typescript
// src/app/api/ai/match/route.ts
if (process.env.GEMINI_API_KEY) {
  try {
    aiText = await generateAIRecommendation({ ... });
  } catch (e) {
    console.warn('Gemini enhancement fallback triggered:', e);
    // Falls back silently — no user-facing error
  }
}
```

The API key is **never exposed to the browser** because it is used only in route handlers (server-side), not in `NEXT_PUBLIC_` prefixed variables.

---

## Cost & Rate Limits

| Metric | Gemini 1.5 Flash |
|:---|:---|
| Free tier | 15 requests/minute, 1,500 requests/day |
| Cost (paid) | Very low — ideal for demo-scale usage |
| Response time | ~500ms–2s |

For a hackathon/SIH demo, the **free tier is more than sufficient**.
