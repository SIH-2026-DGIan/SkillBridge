/**
 * Database Entity Types & Models
 * Defines TypeScript interfaces mirroring the Supabase PostgreSQL schema.
 */

export type UserRole = 'student' | 'industry' | 'institution' | 'academician';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  college?: string | null;
  degree?: string | null;
  branch?: string | null;
  graduation_year?: number | null;
  cgpa?: number | null;
  bio?: string | null;
  location?: string | null;
  company?: string | null;
  institution?: string | null;
  avatar_url?: string | null;
  target_roles?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft';
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: number; // 0 to 100
  source: 'assessment' | 'self' | 'verified';
  updated_at?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  skill_scores: Record<string, number>;
  category_breakdown?: Record<string, number>;
  created_at?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  company_logo?: string | null;
  type: 'internship' | 'job' | 'project';
  location: string;
  stipend?: string | null;
  salary_range?: string | null;
  description: string;
  deadline?: string | null;
  required_skills: {
    skill_id: string;
    importance: 'required' | 'preferred';
    min_proficiency?: number;
  }[];
  posted_by?: string;
  created_at?: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  student_id: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  match_score?: number | null;
  applied_at: string;
  updated_at?: string;
  status_updated_by?: string | null;
  rejection_reason?: string | null;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status?: string | null;
  new_status: string;
  changed_by?: string | null;
  changed_at: string;
  notes?: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tags: string[];
  github_url?: string | null;
  live_url?: string | null;
  stars?: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issued_at: string;
  credential_url?: string | null;
  badge_url?: string | null;
}
