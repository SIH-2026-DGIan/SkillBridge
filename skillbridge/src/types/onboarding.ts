/**
 * Onboarding Type Definitions
 * Supports dynamic Step 04 / Profile Setup for student, tpo, recruiter, and faculty roles.
 */

export type OnboardingRole = 'student' | 'tpo' | 'recruiter' | 'faculty';

export interface BaseOnboardingData {
  fullName: string;
  email: string;
  phone: string;
}

export interface StudentOnboardingData extends BaseOnboardingData {
  profilePictureUrl?: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: string;
  targetRole: string;
  experienceLevel: string;
  skills: Record<string, number>;
  resumeText?: string;
  resumeFileName?: string;
}

export interface TpoOnboardingData extends BaseOnboardingData {
  designation: string;
  institutionName: string;
  institutionCode: string; // AISHE or College Code
  city: string;
  state: string;
  website: string;
  totalBatchSize: number;
  placementSeasonYear: string;
  verificationDocUrl?: string;
  verificationDocName?: string;
}

export interface RecruiterOnboardingData extends BaseOnboardingData {
  designation: string;
  companyName: string;
  industryDomain: string;
  companyWebsite: string;
  companySize: string;
  typicalRoles: string[];
  workModes: string[]; // Remote, Hybrid, Onsite
}

export interface FacultyOnboardingData extends BaseOnboardingData {
  profilePictureUrl?: string;
  institutionName: string;
  department: string;
  designation: string;
  researchAreas: string[];
  scholarUrl?: string; // Google Scholar / ORCID URL
  yearsOfExperience: number;
}

/** Helper to normalize any incoming role string into a canonical OnboardingRole */
export function normalizeOnboardingRole(rawRole: string | null | undefined): OnboardingRole {
  if (!rawRole) return 'student';
  const r = rawRole.toLowerCase().trim();

  if (r === 'tpo' || r === 'institution' || r === 'college') return 'tpo';
  if (r === 'recruiter' || r === 'industry' || r === 'company' || r === 'employer') return 'recruiter';
  if (r === 'faculty' || r === 'academician' || r === 'professor' || r === 'teacher') return 'faculty';
  return 'student';
}

/** Map canonical role back to internal UserRole system ('student' | 'industry' | 'institution' | 'academician') */
export function toInternalUserRole(role: OnboardingRole): 'student' | 'industry' | 'institution' | 'academician' {
  switch (role) {
    case 'tpo':
      return 'institution';
    case 'recruiter':
      return 'industry';
    case 'faculty':
      return 'academician';
    case 'student':
    default:
      return 'student';
  }
}
