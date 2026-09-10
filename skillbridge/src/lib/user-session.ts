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
  profilePictureUrl?: string;
  
  // Student Specific
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  graduationYear?: number;
  cgpa?: number;
  targetRole?: string;
  assessmentDate?: string;
  experienceLevel?: string;
  onboardingStep?: number;
  isProfileComplete?: boolean;
  isAssessed?: boolean;
  assessmentScore?: number;
  
  // Industry Specific
  company?: string;
  industryType?: string;
  companySize?: string;
  location?: string;
  
  // Institution Specific
  institutionName?: string;
  institutionType?: string;
  institutionCode?: string;
  academicYear?: string;
  affiliatedUniversity?: string;
  placementContactName?: string;
  placementEmail?: string;
  contactNumber?: string;
  website?: string;
  state?: string;
  city?: string;
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
  projects?: { title: string; description: string }[];
  experience?: { role: string; company: string; duration: string }[];
}

const DEFAULT_SESSION: UserSession = {
  id: 'user-active-1',
  name: '',
  email: '',
  role: 'student',
  phone: '',
  college: '',
  degree: '',
  branch: '',
  year: '',
  graduationYear: undefined,
  onboardingStep: 1,
  isProfileComplete: false,
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
    
    // Cookie only needs essential auth/routing info. Exclude large data (like base64 images) to prevent 4KB cookie overflow
    const cookieSession = { ...updated };
    delete cookieSession.profilePictureUrl;
    
    document.cookie = `sb-demo-session=${encodeURIComponent(JSON.stringify(cookieSession))}; path=/; max-age=86400; SameSite=Lax`;
    window.dispatchEvent(new Event('sb_session_updated'));
  }

  return updated;
}

export function getStudentSkills(): Record<string, number> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem('sb_student_skills');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to get student skills:', e);
  }

  return {};
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

export function getStudentApplications(): any[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem('sb_student_applications');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to get student applications:', e);
  }

  return [];
}
