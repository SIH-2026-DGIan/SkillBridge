'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ParsedResume } from '@/lib/user-session';

/* ============================================================
   LOCAL FALLBACK PARSER — works without any API key
   Extracts: name, headline, skills, summary, projects, experience
   ============================================================ */

const SKILL_ALIASES: Record<string, string[]> = {
  python: ['python', 'py', 'python3', 'pandas', 'numpy', 'scipy', 'scikit-learn', 'sklearn'],
  javascript: ['javascript', 'js', 'es6', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  java: ['java', 'spring', 'springboot', 'spring boot', 'j2ee'],
  cpp: ['c++', 'cpp', 'c plus plus'],
  c: [' c ', 'c programming'],
  react: ['react', 'react.js', 'reactjs', 'react native'],
  nextjs: ['next.js', 'nextjs', 'next js'],
  html_css: ['html', 'css', 'html5', 'css3', 'html/css', 'sass', 'scss'],
  tailwind: ['tailwind', 'tailwindcss'],
  nodejs: ['node.js', 'nodejs', 'node js', 'node', 'express', 'express.js'],
  fastapi: ['fastapi', 'fast-api', 'fast api'],
  django: ['django', 'django rest framework', 'drf'],
  flask: ['flask'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'oracle', 'pl/sql'],
  mongodb: ['mongodb', 'mongo', 'nosql', 'mongoose'],
  redis: ['redis'],
  graphql: ['graphql'],
  machine_learning: ['machine learning', 'ml', 'scikit-learn', 'supervised learning', 'xgboost', 'random forest'],
  deep_learning: ['deep learning', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer'],
  tensorflow: ['tensorflow', 'tf', 'keras'],
  pytorch: ['pytorch', 'torch'],
  data_analysis: ['data analysis', 'data analytics', 'data visualization', 'tableau', 'power bi'],
  statistics: ['statistics', 'statistical modeling', 'hypothesis testing', 'regression'],
  nlp: ['nlp', 'natural language processing', 'spacy', 'nltk', 'llm', 'langchain', 'bert'],
  computer_vision: ['computer vision', 'opencv', 'yolo', 'image processing', 'object detection'],
  docker: ['docker', 'dockerfile', 'containerization'],
  kubernetes: ['kubernetes', 'k8s', 'helm'],
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  azure: ['azure', 'microsoft azure'],
  gcp: ['gcp', 'google cloud', 'bigquery'],
  git: ['git', 'github', 'gitlab', 'version control'],
  linux: ['linux', 'ubuntu', 'bash', 'shell script', 'unix'],
  flutter: ['flutter', 'dart'],
  kotlin: ['kotlin'],
  swift: ['swift', 'ios', 'swiftui'],
  android: ['android', 'android studio'],
  communication: ['communication', 'presentation skills'],
  problem_solving: ['problem solving', 'analytical skills', 'data structures', 'algorithms', 'dsa'],
  teamwork: ['teamwork', 'collaboration', 'cross-functional'],
  leadership: ['leadership', 'team lead', 'mentoring'],
  critical_thinking: ['critical thinking', 'troubleshooting'],
  time_management: ['time management', 'agile', 'scrum'],
};

const ROLE_HEADLINES: [string[], string][] = [
  [['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'computer_vision'], 'Machine Learning Engineer'],
  [['data analysis', 'data analytics', 'sql', 'statistics', 'tableau'], 'Data Analyst'],
  [['react', 'nextjs', 'html_css', 'tailwind', 'javascript'], 'Frontend Developer'],
  [['nodejs', 'django', 'fastapi', 'flask', 'sql', 'mongodb'], 'Backend Developer'],
  [['react', 'nodejs', 'sql', 'mongodb', 'docker'], 'Full Stack Developer'],
  [['aws', 'docker', 'kubernetes', 'linux', 'git'], 'DevOps / Cloud Engineer'],
  [['flutter', 'kotlin', 'swift', 'android'], 'Mobile Developer'],
  [['java', 'spring', 'sql', 'docker'], 'Java Developer'],
  [['python', 'sql', 'git'], 'Software Engineer'],
];

function splitSections(text: string): Record<string, string> {
  // Identify common resume section headings
  const sectionPattern = /^(SUMMARY|OBJECTIVE|EDUCATION|SKILLS?|TECHNICAL\s+SKILLS?|PROJECTS?|EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT|CERTIFICATIONS?|ACHIEVEMENTS?|EXTRA[-\s]?CURRICULAR|ACTIVITIES|INTERESTS?|CONTACT|REFERENCES?)\s*[:\-]?\s*$/gim;

  const sections: Record<string, string> = { _preamble: '' };
  let currentSection = '_preamble';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const lines = text.split('\n');
  let lineIndex = 0;
  const sectionLines: { name: string; lineIdx: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^(SUMMARY|OBJECTIVE|EDUCATION|SKILLS?|TECHNICAL\s+SKILLS?|PROJECTS?|EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT|CERTIFICATIONS?|ACHIEVEMENTS?|EXTRA[-\s]?CURRICULAR|ACTIVITIES|INTERESTS?|CONTACT|REFERENCES?)[\s:\-]*$/i.test(trimmed)) {
      sectionLines.push({ name: trimmed.replace(/[:]/g, '').trim().toUpperCase(), lineIdx: i });
    }
  }

  // Build section map
  for (let i = 0; i < sectionLines.length; i++) {
    const start = sectionLines[i].lineIdx + 1;
    const end = i + 1 < sectionLines.length ? sectionLines[i + 1].lineIdx : lines.length;
    sections[sectionLines[i].name] = lines.slice(start, end).join('\n');
  }

  if (sectionLines.length > 0) {
    sections['_preamble'] = lines.slice(0, sectionLines[0].lineIdx).join('\n');
  } else {
    sections['_preamble'] = text;
  }

  return sections;
}

function extractName(preamble: string): string {
  const lines = preamble.split('\n').map(l => l.trim()).filter(Boolean);
  // First non-empty line that looks like a name (2-4 words, no special chars, not an email/phone)
  for (const line of lines.slice(0, 5)) {
    if (
      /^[A-Z][a-zA-Z]+([\s][A-Z][a-zA-Z]+){1,3}$/.test(line) &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/\d{5,}/.test(line)
    ) {
      return line;
    }
  }
  return 'Candidate';
}

function extractSkills(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const found: Record<string, number> = {};

  for (const [skillId, aliases] of Object.entries(SKILL_ALIASES)) {
    let score = 0;
    for (const alias of aliases) {
      // Count occurrences — more mentions = higher proficiency estimate
      const regex = new RegExp(`\\b${alias.replace(/[+.]/g, '\\$&')}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        score += matches.length * 20;
      }
    }
    if (score > 0) {
      found[skillId] = Math.min(95, 50 + score); // base 50, cap at 95
    }
  }
  return found;
}

function extractProjects(text: string): { title: string; description: string }[] {
  const projects: { title: string; description: string }[] = [];
  if (!text?.trim()) return projects;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // A project title: numbered (1. / 2.), bulleted, or a short bold-ish line followed by description
    const isTitleLine =
      /^(\d+[\.\)]\s+|[-•*]\s*)?[A-Z]/.test(line) &&
      line.length < 120 &&
      !line.startsWith('-') &&
      !/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line);

    if (isTitleLine) {
      // Strip numbering
      const titleRaw = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•*]\s*/, '');
      // Extract tech stack from parentheses e.g. "Project Name (React, Node.js)"
      const parenMatch = titleRaw.match(/\(([^)]+)\)/);
      const title = titleRaw.replace(/\([^)]+\)/, '').trim();
      const techStack = parenMatch ? parenMatch[1] : '';

      // Gather description lines (bullets following the title)
      const descLines: string[] = [];
      i++;
      while (i < lines.length && (lines[i].startsWith('-') || lines[i].startsWith('•') || lines[i].startsWith('*') || (lines[i].length > 10 && !/^(\d+[\.\)])/.test(lines[i]) && !/^[A-Z][A-Z\s]{5,}:?$/.test(lines[i])))) {
        descLines.push(lines[i].replace(/^[-•*]\s*/, ''));
        i++;
      }

      const description = [
        techStack ? `Tech: ${techStack}.` : '',
        ...descLines.slice(0, 2),
      ].filter(Boolean).join(' ').slice(0, 200);

      if (title.length > 3) {
        projects.push({ title, description: description || 'No description available.' });
      }
    } else {
      i++;
    }
  }

  return projects.slice(0, 6);
}

function extractExperience(text: string): { role: string; company: string; duration: string }[] {
  const exp: { role: string; company: string; duration: string }[] = [];
  if (!text?.trim()) return exp;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const datePattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)?\s*\d{4}\s*[-–—to]+\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)?\s*(\d{4}|present|current)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(datePattern) || (i + 1 < lines.length && lines[i + 1].match(datePattern));

    if (dateMatch) {
      const duration = dateMatch[0].trim();
      // Role/company are usually on this line or the previous line
      const contextLine = dateMatch === line.match(datePattern) ? line : lines[i];
      // Strip the date from the line to get role/company
      const withoutDate = contextLine.replace(datePattern, '').replace(/[|\-–,]/g, ' ').trim();
      const parts = withoutDate.split(/\s{2,}|,|\bat\b|\|/).map(p => p.trim()).filter(Boolean);

      exp.push({
        role: parts[0] || 'Role',
        company: parts[1] || 'Company',
        duration,
      });
    }
  }

  // If date-based extraction found nothing, try "Role @ Company" or "Role – Company" patterns
  if (exp.length === 0) {
    for (const line of lines) {
      const atMatch = line.match(/^(.+?)\s+(?:@|at|–|-)\s+(.+)$/i);
      if (atMatch && atMatch[1].length < 60 && atMatch[2].length < 60) {
        exp.push({ role: atMatch[1].trim(), company: atMatch[2].trim(), duration: '' });
      }
    }
  }

  return exp.slice(0, 5);
}

function inferHeadlineAndRole(skills: Record<string, number>): { headline: string; targetRole: string } {
  const skillIds = Object.keys(skills);
  let best = { headline: 'Software Engineer', targetRole: 'Software Engineer', score: 0 };

  for (const [requiredSkills, role] of ROLE_HEADLINES) {
    const score = requiredSkills.filter(s => skillIds.includes(s)).length;
    if (score > best.score) {
      best = { headline: role, targetRole: role, score };
    }
  }
  return best;
}

function inferExperienceLevel(text: string, experienceItems: { role: string; company: string; duration: string }[]): string {
  const lower = text.toLowerCase();
  if (/senior|lead|principal|staff|architect|head of|vp\s|director/i.test(lower)) return 'Senior Level';
  if (/mid.?level|3[\+\s]years?|4[\+\s]years?|5[\+\s]years?/i.test(lower)) return 'Mid Level';
  if (experienceItems.length >= 2) return 'Mid Level';
  if (/intern|fresher|graduate|entry.?level|0[\-–]1\s+year/i.test(lower)) return 'Graduate / Entry Level';
  return 'Graduate / Entry Level';
}

function buildSummary(name: string, headline: string, skills: Record<string, number>): string {
  const topSkills = Object.keys(skills).slice(0, 5).map(s => s.replace(/_/g, ' ')).join(', ');
  if (!topSkills) return `${name} is a ${headline} seeking new opportunities.`;
  return `${name} is a ${headline} with skills in ${topSkills}. Passionate about building impactful solutions.`;
}

function parseResumeLocally(text: string, fileName: string): ParsedResume {
  const sections = splitSections(text);

  // Merge all text for skill extraction
  const fullText = text;

  // Extract each piece
  const name = extractName(sections['_preamble'] || '');
  const skills = extractSkills(fullText);
  const { headline, targetRole } = inferHeadlineAndRole(skills);

  // Projects: prefer PROJECTS section, fall back to scanning full text
  const projectSection =
    sections['PROJECTS'] ||
    sections['PROJECT'] ||
    sections['PERSONAL PROJECTS'] ||
    sections['ACADEMIC PROJECTS'] ||
    '';
  const projects = extractProjects(projectSection || fullText);

  // Experience: prefer EXPERIENCE section
  const expSection =
    sections['EXPERIENCE'] ||
    sections['WORK EXPERIENCE'] ||
    sections['EMPLOYMENT'] ||
    sections['INTERNSHIPS'] ||
    sections['PROFESSIONAL EXPERIENCE'] ||
    '';
  const experience = extractExperience(expSection || fullText);

  const experienceLevel = inferExperienceLevel(fullText, experience);
  const summary = buildSummary(name, headline, skills);

  return {
    fileName,
    parsedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    candidateName: name,
    headline,
    extractedSkills: skills,
    summary,
    experienceLevel,
    targetRole,
    projects,
    experience,
  };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function parseResumeWithGemini(
  text: string,
  fileName: string = 'Resume.pdf'
): Promise<ParsedResume> {
  const apiKey = process.env.GEMINI_API_KEY;

  // ── No API key: use local parser immediately ──────────────────────────────
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    console.info('[ResumeParser] No GEMINI_API_KEY — using local parser.');
    return parseResumeLocally(text, fileName);
  }

  // ── Gemini AI path ────────────────────────────────────────────────────────
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert technical recruiter and resume parser.
Extract the following information from the resume text below into strict JSON.

Return ONLY valid JSON with this exact schema — no markdown, no extra text:
{
  "candidateName": "string",
  "headline": "string (e.g. Full Stack Engineer)",
  "extractedSkills": { "skill_id_lowercase_underscore": 85 },
  "summary": "1-2 sentence professional summary",
  "experienceLevel": "Graduate / Entry Level | Mid Level | Senior Level",
  "targetRole": "string",
  "projects": [
    { "title": "string", "description": "string" }
  ],
  "experience": [
    { "role": "string", "company": "string", "duration": "string" }
  ]
}

Resume:
"""
${text}
"""`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const raw = result.response.text();
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      fileName,
      parsedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      candidateName: parsed.candidateName || 'Candidate',
      headline:      parsed.headline      || 'Software Engineer',
      extractedSkills: parsed.extractedSkills || {},
      summary:       parsed.summary       || 'Resume parsed successfully.',
      experienceLevel: parsed.experienceLevel || 'Graduate / Entry Level',
      targetRole:    parsed.targetRole    || 'Software Engineer',
      projects:      Array.isArray(parsed.projects)   ? parsed.projects   : [],
      experience:    Array.isArray(parsed.experience) ? parsed.experience : [],
    };
  } catch (error) {
    // Gemini failed for any reason → fall back to local parser so the user always gets a result
    console.warn('[ResumeParser] Gemini failed, falling back to local parser:', error);
    return parseResumeLocally(text, fileName);
  }
}
