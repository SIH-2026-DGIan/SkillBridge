/**
 * User Session & Student State Manager
 * Dynamic, role-aware profile state for Student, Industry, Institution, and Academician.
 */

import { DEMO_STUDENT_SKILLS } from './demo-data';

export type UserRole = 'student' | 'industry' | 'institution' | 'academician';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  
  // Student Specific
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  graduationYear?: number;
  targetRole?: string;
  onboardingStep?: number;
  isAssessed?: boolean;
  assessmentScore?: number;
  
  // Industry Specific
  company?: string;
  industryType?: string;
  companySize?: string;
  location?: string;
  
  // Institution Specific
  institutionName?: string;
  tpoHead?: string;
  totalBatchSize?: number;

  // Academician Specific
  department?: string;
  researchDomain?: string;

  isDemo?: boolean;
}

export interface ParsedResume {
  fileName: string;
  parsedAt: string;
  candidateName: string;
  headline: string;
  extractedSkills: Record<string, number>;
  summary: string;
  experienceLevel: string;
  targetRole: string;
}

const DEFAULT_SESSION: UserSession = {
  id: 'user-active-1',
  name: 'Arav Gupta',
  email: 'arav.gupta@student.edu',
  role: 'student',
  college: 'Dronacharya Group of Institutions',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  year: '3rd Year',
  graduationYear: 2026,
  targetRole: 'Machine Learning Engineer',
  onboardingStep: 5,
  isAssessed: true,
  assessmentScore: 78,
};

export function getSession(): UserSession {
  if (typeof window === 'undefined') return DEFAULT_SESSION;

  try {
    const raw = localStorage.getItem('sb_user_session');
    if (raw) return JSON.parse(raw);

    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>);

    if (cookies['sb-demo-session']) {
      const sess = JSON.parse(decodeURIComponent(cookies['sb-demo-session']));
      return {
        ...DEFAULT_SESSION,
        ...sess,
      };
    }
  } catch (e) {
    console.warn('Failed to parse session:', e);
  }

  return DEFAULT_SESSION;
}

export function setSession(session: Partial<UserSession>): UserSession {
  const current = getSession();
  const updated: UserSession = {
    ...current,
    ...session,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('sb_user_session', JSON.stringify(updated));
    document.cookie = `sb-demo-session=${JSON.stringify(updated)}; path=/; max-age=86400; SameSite=Lax`;
    window.dispatchEvent(new Event('sb_session_updated'));
  }

  return updated;
}

export function getStudentSkills(): Record<string, number> {
  if (typeof window === 'undefined') return DEMO_STUDENT_SKILLS;

  try {
    const raw = localStorage.getItem('sb_student_skills');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to get student skills:', e);
  }

  return DEMO_STUDENT_SKILLS;
}

export function setStudentSkills(skills: Record<string, number>): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sb_student_skills', JSON.stringify(skills));
    window.dispatchEvent(new Event('sb_skills_updated'));
  }
}

export function getStudentResume(): ParsedResume | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem('sb_parsed_resume');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to get resume:', e);
  }

  return null;
}

export function setStudentResume(resume: ParsedResume): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sb_parsed_resume', JSON.stringify(resume));
    setStudentSkills(resume.extractedSkills);
    window.dispatchEvent(new Event('sb_resume_updated'));
  }
}
