# 📄 Resume Parser Documentation

**File**: [`src/lib/ai/resume-parser.ts`](../../skillbridge/src/lib/ai/resume-parser.ts)

The SkillBridge Resume Parser is a **client-side, pattern-matching skill extractor** that parses plain-text resumes and extracts structured skill proficiency data without requiring any external API.

---

## What It Does

1. Accepts plain-text resume content
2. Matches text against the canonical 36-skill taxonomy
3. Assigns proficiency levels based on contextual signals in the text
4. Returns a structured `ParsedResume` object with extracted skills, candidate metadata, and experience level

---

## Output Structure

```typescript
interface ParsedResume {
  fileName: string;          // Original resume filename
  parsedAt: string;          // ISO timestamp of parsing
  candidateName: string;     // Extracted candidate name
  headline: string;          // Role/title extracted or inferred
  summary: string;           // Brief professional summary
  experienceLevel: string;   // 'fresher' | 'junior' | 'mid' | 'senior'
  targetRole: string;        // Inferred best-fit role
  extractedSkills: Record<string, number>;  // { skillId: proficiency 0-100 }
}
```

---

## Proficiency Assignment Logic

The parser assigns proficiency levels based on **contextual keyword signals** found near skill mentions:

| Signal Words | Proficiency Assigned |
|:---|:---|
| `expert`, `advanced`, `lead`, `architect` | 85–95 |
| `proficient`, `experienced`, `strong` | 70–80 |
| `familiar`, `basic`, `learning`, `beginner` | 30–50 |
| Listed in skills section | 65 (default) |
| Mentioned in project technologies | 70 |
| Mentioned in summary/description | 60 |

---

## Sample Resumes

The parser ships with **3 built-in sample resumes** for quick testing without uploading a file:

| ID | Title | Target Role |
|:---|:---|:---|
| `sample-aiml` | 🤖 AI & Machine Learning CV | Machine Learning Engineer |
| `sample-fullstack` | 💻 Full-Stack Web & Cloud Developer CV | Full Stack Engineer |
| `sample-data` | 📊 Data Science & Analytics CV | Data Scientist |

```typescript
import { SAMPLE_RESUMES, parseResumeText } from '@/lib/ai/resume-parser';

// Use a sample resume
const sample = SAMPLE_RESUMES[0];
const result = parseResumeText(sample.text, sample.title);
```

---

## Usage Example

```typescript
import { parseResumeText } from '@/lib/ai/resume-parser';
import { setStudentResume } from '@/lib/user-session';

// When user uploads a file
const file = event.target.files[0];
const text = await file.text();

const parsed = parseResumeText(text, file.name);
// parsed.extractedSkills = { python: 85, machine_learning: 72, docker: 65, ... }

// Save to session (localStorage)
setStudentResume(parsed);
```

---

## Integration with the Student Resume Page

The resume parser powers the **Resume Builder** page at `/student/resume`:

1. Student uploads a `.txt` resume or selects a sample
2. `parseResumeText()` extracts skills with proficiency values
3. Extracted skills are saved via `setStudentResume()` → `setStudentSkills()`
4. All downstream pages (dashboard, skill gaps, opportunities) automatically use the updated skills

---

## Limitations

| Limitation | Notes |
|:---|:---|
| **Text-only** | Accepts plain text. PDF/DOCX must be converted to text first. |
| **No LLM required** | Entirely deterministic — works offline without any API key. |
| **English only** | Skill keyword matching is English-based. |
| **36 canonical skills** | Only recognizes skills from the predefined taxonomy in `skills-taxonomy.ts`. |

---

## Future Improvements (Planned)

- Server-side endpoint (`POST /api/resume/parse`) for PDF upload handling
- Gemini-powered extraction for unstructured resume formats
- Support for LinkedIn profile URL import
- DOCX and PDF parsing via file conversion pipeline
